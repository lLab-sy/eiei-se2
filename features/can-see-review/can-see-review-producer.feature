@review @reviewpd
Feature: Producer Can See Review on Production Professional Page
    As a producer
    I want to see production professionals' reviews
    So that I can see make informed decisions about whether to work with them

    Background:
        Given the "producer" is logged in

    @pdcheckpf
    Scenario: Producer wants to check a Production Professional's rating score
        When the producer has a target production professional and "Does Nothing"
        Then "Producer" should see "production professional's" review section
        And I should see at least one review
        And the reviews should be displayed correctly