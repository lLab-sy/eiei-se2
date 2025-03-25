@approve
Feature: Producer Approve Production Professional Submission
    As a Producer
    I want to mark a post as complete once the project is finished and agreed upon by both parties
    so that I can check my previous projects in the post history
    
    @apprvesubmission
    Scenario: Approve the submission
        Given the "producer" is logged in
            And I visit "My Post"
            And the producer has a project on state "In-Progress"
            And the producer click on the project "test post for 2-4 producer"
            And the producer has production prodessional "Sent" the submissionns
        When "Approve" button in confirmation is clicked
            And "Confirm" button in popup is clicked
        Then ensure the production professional status is "Approved" 

    @rejectsubmission
    Scenario: Reject the submission
        Given the "producer" is logged in
            And I visit "My Post"
            And the producer has a project on state "In-Progress"
            And the producer click on the project "test post for 2-4 producer"
            And the producer has production prodessional "Sent" the submissionns
        When "Reject" button in confirmation is clicked
            And I click the "Confirm" button
        Then ensure the production professional status is "In-Progress" 

    @approveall
    Scenario: Approve all submissions
        Given the "producer" is logged in
            And I visit "My Post"
            And the producer has a project on state "In-Progress"
            And the producer click on the project "test post for 2-4 producer"
        When I click the "Mark as Complete" button
            And I click the "Confirm" button
        Then the post status is 'success'
            And ensure all production professional status is "Approved" 
