package com.ai.dashboard.ai.vector.config;

import io.netty.channel.ChannelOption;
import io.netty.handler.timeout.ReadTimeoutHandler;
import io.netty.handler.timeout.WriteTimeoutHandler;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.netty.http.client.HttpClient;

import java.util.concurrent.TimeUnit;

import static io.netty.buffer.ByteBufAllocator.DEFAULT;
import static org.springframework.http.HttpHeaders.ACCEPT;
import static org.springframework.http.HttpHeaders.CONTENT_TYPE;
import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

/**
 * Provides the configured {@link WebClient} used to talk to the Qdrant server.
 */
@Configuration
public class QdrantWebClientConfig {

    @Bean(name = "qdrantWebClient")
    public WebClient qdrantWebClient(VectorStoreProperties props) {
        String rawHost = props.getHost();
        String baseUrl;
        if (rawHost.startsWith("http://") || rawHost.startsWith("https://")) {
            baseUrl = rawHost.endsWith("/") ? rawHost.substring(0, rawHost.length() - 1) : rawHost;
        } else {
            String protocol = (props.getPort() == 443 || rawHost.contains("cloud.qdrant.io")) ? "https://" : "http://";
            baseUrl = protocol + rawHost + ":" + props.getPort();
        }

        long timeoutSecs = props.getTimeout().getSeconds();

        HttpClient httpClient = HttpClient.create()
                .option(ChannelOption.CONNECT_TIMEOUT_MILLIS, (int) TimeUnit.SECONDS.toMillis(timeoutSecs))
                .option(ChannelOption.ALLOCATOR, DEFAULT)
                .doOnConnected(conn -> conn
                        .addHandlerLast(new ReadTimeoutHandler(timeoutSecs, TimeUnit.SECONDS))
                        .addHandlerLast(new WriteTimeoutHandler(timeoutSecs, TimeUnit.SECONDS)));

        WebClient.Builder builder = WebClient.builder()
                .baseUrl(baseUrl)
                .defaultHeader(CONTENT_TYPE, APPLICATION_JSON_VALUE)
                .defaultHeader(ACCEPT, APPLICATION_JSON_VALUE);

        if (props.getApiKey() != null && !props.getApiKey().isBlank()) {
            builder.defaultHeader("api-key", props.getApiKey().trim());
        }

        return builder
                .clientConnector(new ReactorClientHttpConnector(httpClient))
                .build();
    }
}