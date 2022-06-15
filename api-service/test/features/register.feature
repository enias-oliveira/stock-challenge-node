Feature: Auth module
  Allow user to create an account in order to use our services

  Scenario: Register new user
    Given I have an e-mail that has not been registered before
    When I register with:
        | email | "hubber" |
        | role  | "user"   |
    Then I should receive a password of 32 characters long
