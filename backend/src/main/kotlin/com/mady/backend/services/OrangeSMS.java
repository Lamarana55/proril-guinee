package com.mady.backend.services;


import com.squareup.okhttp.*;
import net.minidev.json.JSONObject;
import net.minidev.json.parser.JSONParser;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class OrangeSMS {

    public OkHttpClient client;

    @Value("${ws.app.sms.sendername}")
    private String senderName;

    public OrangeSMS() {
        client = new OkHttpClient();
    }

    public String getToken() {

        MediaType mediaType = MediaType.parse("application/x-www-form-urlencoded");
        RequestBody body = RequestBody.create(mediaType, "grant_type=client_credentials");
        Request request = new Request.Builder()
                .url("https://api.orange.com/oauth/v3/token")
                .method("POST", body)
                .addHeader("Authorization", "Basic YUtFVjZtQzhHTDFIU2pKNmpJOTV0TzJVR1hLbzU5Smw6OWZ1eURvUWkxV3dXTVhzNA==")
                .addHeader("Content-Type", "application/x-www-form-urlencoded")
                .addHeader("Accept", "application/json")
                .build();
        try {
            Response response = client.newCall(request).execute();

            String jsonData = response.body().string();

            JSONParser parser = new JSONParser();
            JSONObject jsonObject = (JSONObject) parser.parse(jsonData);
            JSONObject myjson = new JSONObject(jsonObject);

            return myjson.get("access_token").toString();
        } catch (Exception e) {
            return "";
        }

    }

    public boolean sendMessage(String telephone, String message) {

        String token = getToken();

        telephone = "+224" + telephone;
        MediaType mediaType = MediaType.parse("application/json");
        RequestBody body = RequestBody.create(mediaType, "{\"outboundSMSMessageRequest\":{\r\n    " +
                "    \"address\": \"tel:" + telephone + "\",\r\n   \"senderAddress\":\"tel:+224628228638\",\r\n   \"senderName\": \"" + senderName + "\", \r\n  " +
                "   \"outboundSMSTextMessage\":{\r\n            \"message\":\"" + message + "\"\r\n        }\r\n    }\r\n}");

        Request request = new Request.Builder()
                .url("https://api.orange.com/smsmessaging/v1/outbound/tel%3A%2B224628228638/requests")
                .method("POST", body)
                .addHeader("Authorization", "Bearer " + token)
                .addHeader("Content-Type", "application/json")
                .build();
        try {
            if (telephone.startsWith("+22465")) {
                System.out.println("C'est un numero cellcom");
                return false;
            } else {
                Response response = client.newCall(request).execute();

                System.out.println("response " + response + " code : " + response.code());
                return true;
            }
        } catch (Exception e) {
            return false;
        }
    }

    public void sendSMS(String libelle, String telephone) {

        String typeCas = libelle.equals("MARIAGE ENFANT")? "mariage d'enfant": libelle.toLowerCase();
        String message;
        message = "Votre alerte de "+ typeCas + " a été remontée, nous vous contacterons pour plus de précision.";
        sendMessage(telephone, message);

    }

    public void sendSMSRapport(String mois, String typeCas, String telephone){
        String articleMois = (mois.equals("Avril"))? "d'":"de";
        String type = (typeCas.equals("MARIAGE ENFANT"))?"mariage d'enfant" : typeCas.toLowerCase();
        String message = "Vous venez d'effectuer votre rapport du mois "+ articleMois +" "+ mois + " pour le type de cas : "+type ;
        sendMessage(telephone, message);
    }
}
