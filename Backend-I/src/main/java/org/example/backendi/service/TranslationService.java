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
            // Encode full multiline text safely
            String encoded = URLEncoder.encode(text, StandardCharsets.UTF_8);

            String url =
                    "https://translate.googleapis.com/translate_a/single"
                            + "?client=gtx"
                            + "&sl=gu"
                            + "&tl=en"
                            + "&dt=t"
                            + "&q=" + encoded;

            String response = restTemplate.getForObject(url, String.class);

            JsonNode root = objectMapper.readTree(response);

            String translatedText = root.get(0).get(0).get(0).asText();

            return translatedText;

        } catch (Exception e) {
            e.printStackTrace();
            return text;
        }
    }
}