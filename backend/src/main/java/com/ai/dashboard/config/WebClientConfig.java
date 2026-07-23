package com.ai.dashboard.config;

import io.netty.channel.ChannelOption;
import io.netty.handler.timeout.ReadTimeoutHandler;
import io.netty.handler.timeout.WriteTimeoutHandler;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.http.codec.ClientCodecConfigurer;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.netty.http.client.HttpClient;

import java.util.concurrent.TimeUnit;

import static io.netty.buffer.ByteBufAllocator.DEFAULT;
import static org.springframework.http.HttpHeaders.ACCEPT;
import static org.springframework.http.HttpHeaders.CONTENT_TYPE;
import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

/**
 * Provides the configured {@link WebClient} used to talk to the local Ollama
 * server. Keeping the client here allows it to be injected (and mocked in tests).
 */
@Configuration
public class WebClientConfig {

    @Bean("ollamaWebClient")
    public WebClient ollamaWebClient(OllamaProperties props) {
        HttpClient httpClient = HttpClient.create()
                .option(ChannelOption.CONNECT_TIMEOUT_MILLIS, (int) TimeUnit.SECONDS.toMillis(props.getTimeout()))
                .option(ChannelOption.ALLOCATOR, DEFAULT)
                .doOnConnected(conn -> conn
                        .addHandlerLast(new ReadTimeoutHandler(props.getTimeout(), TimeUnit.SECONDS))
                        .addHandlerLast(new WriteTimeoutHandler(props.getTimeout(), TimeUnit.SECONDS)));

        int maxInMemory = 16 * 1024 * 1024; // 16 MB for large LLM responses

        return WebClient.builder()
                .baseUrl(props.getBaseUrl())
                .defaultHeader(CONTENT_TYPE, APPLICATION_JSON_VALUE)
                .defaultHeader(ACCEPT, APPLICATION_JSON_VALUE)
                .codecs(cfg -> cfg.defaultCodecs().maxInMemorySize(maxInMemory))
                .clientConnector(new ReactorClientHttpConnector(httpClient))
                .build();
    }
}