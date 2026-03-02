package org.example.backendi.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.regex.Pattern;

@Service
public class TranslationService {
    private static final Pattern GUJARATI_PATTERN = Pattern.compile("[\\u0A80-\\u0AFF]");
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public String translateGujaratiToEnglish(String text) {
        try {
            StringBuilder result = new StringBuilder();

            String[] lines = text.split("\\n");

            for (String line : lines) {

                if (line.trim().isEmpty()) {
                    result.append("\n");
                    continue;
                }

                String encodedText = URLEncoder.encode(line, StandardCharsets.UTF_8);

                if (encodedText.length() > 450) {
                    // Skip translation if single line too big
                    result.append(line).append("\n");
                    continue;
                }

                String url = "https://api.mymemory.translated.net/get"
                        + "?q=" + encodedText
                        + "&langpair=gu|en";

                String response = restTemplate.getForObject(url, String.class);

                JsonNode root = objectMapper.readTree(response);
                String translated = root
                        .path("responseData")
                        .path("translatedText")
                        .asText();

                result.append(translated).append("\n");
            }

            return result.toString().trim();

        } catch (Exception e) {
            e.printStackTrace();
            return text;
        }
    }

    public boolean containsGujarati(String text) {
        return GUJARATI_PATTERN.matcher(text).find();
    }
}