# Pull Request Process

Please follow the below steps to avoid pushing errors into our main branch.

## Submitting a Pull Request

1. Before submitting your pull request, follow these steps:   
   1. Switch to the main branch and run **git pull**   
   2. Checkout the branch your working on and run **git rebase main** (this makes sure that any conflicts or errors happen in your branch, not the main branch)  
   3. Test your code and deal with any conflicts or errors that happened when rebasing  
   4. Run your code locally using app.py to test. If there are any errors, fix these and retest until no errors appear on your end (ask for help if needed).  
   5. Run **git push origin \<your-branch-name\>**  
2. While submitting your pull request:  
   1. Use the PR template in the admin/templates folder to write your pull request  
   2. You should provide information about the expected behavior, when the expected behavior should happen, any additional steps the reviewer should take, and add images if that will help  
   3. Add at least one reviewer. If your change involves the front end and the backend, ask a member from both teams to review. If you worked on the changes with someone, you may want to add someone different as a reviewer to ensure they can replicate the expected behavior.   
3. After submitting:  
   1. What for review, then merge only after the PR is approved

## Reviewing a Pull Request

1. Follow these steps:  
   1. Checkout the branch associated with the PR and run locally to ensure expected behavior is showing  
   2. Suggest any changes necessary, point out errors in as much detail as possible  
   3. Approve only once code can be safely merged to main