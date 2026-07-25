package com.ai.dashboard.ai.provider;

import org.springframework.stereotype.Component;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Registry that maps provider names to their {@link LlmProviderStrategy}
 * implementations.
 *
 * <p>Spring injects all concrete strategies via constructor injection and
 * the registry exposes lookup-by-name so that the service layer can switch
 * providers without any hard-coded conditionals.</p>
 */
@Component
public class ProviderRegistry {

    private final Map<String, LlmProviderStrategy> strategies = new LinkedHashMap<>();

    public ProviderRegistry(List<LlmProviderStrategy> allStrategies) {
        for (LlmProviderStrategy strategy : allStrategies) {
            strategies.put(strategy.getProviderName(), strategy);
        }
    }

    /**
     * Look up a strategy by its provider name (e.g. "OpenAI", "Ollama").
     */
    public Optional<LlmProviderStrategy> find(String providerName) {
        return Optional.ofNullable(strategies.get(providerName));
    }

    /**
     * Look up a strategy or throw {@link IllegalArgumentException} if the
     * provider is not supported.
     */
    public LlmProviderStrategy get(String providerName) {
        LlmProviderStrategy strategy = strategies.get(providerName);
        if (strategy == null) {
            throw new IllegalArgumentException("Unsupported provider: " + providerName);
        }
        return strategy;
    }

    /**
     * @return an ordered list of all supported provider names.
     */
    public List<String> getSupportedProviders() {
        return List.copyOf(strategies.keySet());
    }

    /**
     * @return all registered strategies.
     */
    public List<LlmProviderStrategy> getAllStrategies() {
        return List.copyOf(strategies.values());
    }
}
