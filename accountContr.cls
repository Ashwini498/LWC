public with sharing class accountContr {
    @AuraEnabled
    public static Account createAccount(String name, String industry, String rating) {
        Account newAccount = new Account(
            Name = name,
            Industry = industry,
            Rating = rating
        );
        insert newAccount;
        return newAccount;
    }
}