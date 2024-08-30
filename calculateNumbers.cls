public with sharing class calculateNumbers {
    @AuraEnabled
    public static Integer getSumResult(Integer firstNumber, Integer secondNumber) {
        return firstNumber + secondNumber;
    }

    @AuraEnabled
    public static Integer getSubResult(Integer firstNumber, Integer secondNumber) {
        return firstNumber - secondNumber;
    }

    @AuraEnabled
    public static Integer getMulResult(Integer firstNumber, Integer secondNumber) {
        return firstNumber * secondNumber;
    }
}