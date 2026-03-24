package org.example.backendi.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Service
public class TranslationService {

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public String translateGujaratiToEnglish(String text) {

        try {

             String encodedText =
                    URLEncoder.encode(text, StandardCharsets.UTF_8);

            String url =
                    "https://translate.googleapis.com/translate_a/single" +
                            "?client=gtx" +
                            "&sl=gu" +
                            "&tl=en" +
                            "&dt=t" +
                            "&q=" + encodedText;

            String response =
                    restTemplate.getForObject(url, String.class);

            JsonNode root = objectMapper.readTree(response);

            JsonNode translations = root.get(0);

            StringBuilder result = new StringBuilder();

            for (JsonNode segment : translations) {
                result.append(segment.get(0).asText());
            }

            return result.toString();

        } catch (Exception e) {
            e.printStackTrace();
            return text; // fallback safely
        }
    }
}