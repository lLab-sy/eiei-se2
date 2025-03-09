Feature: Create Offer for Production Professionals
  As a producer
  I want to create an offer to production professionals I find suitable for the project
  So that I can recruit a production professional to work on my project

  Scenario: Successfully create an offer to a production professional
    Given the producer is logged in
      And the producer has target posts
      And the producer has a target production professional
      And the wages field is filled with "5000"
    When the producer requests to create an offer
    Then the system sends an offer to the production professional
      And the offer appears in the producer post's offer list
      And the system adds a change to the offer's history

  Scenario: Fail to create an offer due to missing wages
    Given the producer is logged in
      And the producer has target posts
      And the producer has a target production professional
      And the wages field is not filled out
    When the producer requests to create an offer
    Then the system shows an error message "Failed to create an offer with the production professional"
