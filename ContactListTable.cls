public with sharing class ContactListTable {
    @AuraEnabled(cacheable=true)
    public static List<Contact> getContacts() {
        return [SELECT Id, FirstName, LastName, Birthdate, LeadSource FROM Contact LIMIT 5];
    }
 
     @AuraEnabled(cacheable=true)
    public static List<String> getLeadSourcePicklistValues() {
       
        List<String> leadSourceValues = new List<String>();
        
        Schema.DescribeFieldResult fieldResult = Contact.LeadSource.getDescribe();
        List<Schema.PicklistEntry> picklistEntries = fieldResult.getPicklistValues();
        
     
        for (Schema.PicklistEntry entry : picklistEntries) {
            leadSourceValues.add(entry.getLabel());
        }
        
        return leadSourceValues;
    }
 
    @AuraEnabled
    public static void updateContacts(List<Contact> contacts) {
        update contacts;
    }
}