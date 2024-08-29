public with sharing class contactContr {
    @AuraEnabled
    public static Contact createContact(String firstName, String lastName, String email, String phone, Id accountId) {
        Contact newContact = new Contact(
            FirstName = firstName,
            LastName = lastName,
            Email = email,
            Phone = phone,
            AccountId = accountId
        );
        insert newContact;
        return newContact;
    }
}