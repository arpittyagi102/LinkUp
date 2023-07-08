const axios = require('axios');
const fs = require('fs');

const owner = 'arpittyagi102';
const repo = 'linkup';

// Fetch the contributors from the GitHub API
axios.get(`https://api.github.com/repos/${owner}/${repo}/contributors`)
  .then((response) => {
    // Generate the contributors section in markdown format
    let contributorsSection = '## Contributors\n\n';
    response.data.forEach((contributor) => {
      contributorsSection += `<a href="${contributor.html_url}">
  <img src="https://images.weserv.nl/?url=${contributor.avatar_url}&h=300&w=300&fit=cover&mask=circle&maxage=7d" width="120px"/>
</a>
`;
    });

    // Read the existing README.md file
    fs.readFile('README.md', 'utf8', (readError, data) => {
      if (readError) {
        console.error(`Error reading README.md: ${readError}`);
        return;
      }

      // Update the contributors section in the README content
      const regex = new RegExp('## Contributors[\\s\\S]*<br class="br"/>');
      const updatedReadmeContent = data.replace(
        regex,
        `## Contributors\n\n${contributorsSection}\n<br class="br"/>`
      );

      console.log(updatedReadmeContent);
      // Write the updated content back to the README.md file
       fs.writeFile('README.md', updatedReadmeContent, 'utf8', (writeError) => {
        if (writeError) {
          console.error(`Error writing to README.md: ${writeError}`);
          return;
        }
        console.log('Contributors section updated in README.md');
      }); 
    });
  })
  .catch((error) => {
    console.error(`Error fetching contributors: ${error}`);
  });
