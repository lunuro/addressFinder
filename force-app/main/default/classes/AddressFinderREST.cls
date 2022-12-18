/**
 * @description       : Class to get address from external API from postcode
 * @author            : lunuro
 * @group             : lunuro
 * @last modified on  : 18-12-2022
 * @last modified by  : lunuro 
 * Modifications Log
 * Ver   Date         Author     Modification
 * 1.0   18-12-2022   lunuro   Initial Version
**/
public with sharing class AddressFinderREST {
    /**
    * @description Method to obtain an addresses list that belong to a postcode
    * @author lunuro | 18-12-2022 
    * @param String postCode 
    * @return String 
    **/
    @AuraEnabled
    public static String getAddressList(String postCode){

        String resFinder = '';
        String key = System.Label.getAddressKey;
        String endpoint = 'callout:getAddress' + '/find/' +postCode.deleteWhitespace() + '?api-key=' + key + '&expand=true';
        Integer timeOut = 120000;
        Http http = new Http();
        HttpRequest req = new HttpRequest();
        req.setEndpoint(endpoint);
        req.setMethod('GET');
        req.setTimeout(timeout);

        try {
            HTTPResponse res = http.send(req);
            switch on res.getStatusCode() {
                when 200 {
                    resFinder = res.getBody();
                }
                when 400 {
                    resFinder = 'Postcode invalid';
                }
                when else {
                    resFinder = 'Error ' + res.getStatusCode() + ': ' + res.getBody();
                }
            }
            return resFinder;
        } catch (Exception exc) {
            resFinder = exc.getMessage();
            return resFinder;
        }
    }
}
