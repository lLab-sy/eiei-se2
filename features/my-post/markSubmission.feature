@mypost @mypost-prof
Feature: Production Professional Can Submit Working
   As a Production Professional
   I want to submit my working
   so that I can get Sent status

    Background:
        Given the "production professional" is logged in
    
    @cansend
    Scenario: Professional want to send Project
        When the professional view his/her "Test Submission Post"
        Then Professional should click at "Submit new task" and see recent task

    @cannotsend
    Scenario: Professional can't send Project from out of working quota
        When the professional view his/her "Test No Submission Post"
        Then  Professional can see all his task "3" times in post detail and has no "Submit new task"