@
Feature: Production Professional Can See Review on User Profile
   As a Producer
   I want to change the state of a post
   so that I can manage the progress of the project

    Background:
        Given the "producer" is logged in
    
    @
    Scenario: Producer want to start Project
        When the producer "View My-Post"
        And has the "target post at waiting state"
        Then "Produer" should click at "start button"
        And "Producer" can see "in-progress" status in post detail