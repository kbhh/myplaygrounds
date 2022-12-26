const cheerio = require('cheerio');
const axios = require('axios');

async function scrapeJobs() {
    // Initialize an array to store the extracted job information
    const jobs = [];
    let page = 1;

    // Paginate through the search results
    while (true) {
        // Fetch the search results page
        const res = await axios.get(`https://www.ethiojobs.net/search-results-jobs/?searchId=1672082090.212&action=search&page=${page}&view=list`);
        const html = res.data;

        // Load the HTML code into cheerio
        const $ = cheerio.load(html);

        // Check if there are any job listings on the page
        if ($('tr.oddrow').length === 0) {
            // No job listings, exit the loop
            break;
        }

        // Iterate over each `tr` element with the class `oddrow`
        $('tr.oddrow').each((index, element) => {
            // Extract the job information for each element
            const job = {};
            job.title = $(element).find('.listing-title h2 a').text().trim();
            job.link = $(element).find('.listing-title h2 a').attr('href');
            job.postedOn = $(element).find('.listing-title .captions-field').text().trim();
            job.company = $(element).find('.detailed_view .company-name').text().trim();
            job.location = $(element).find('.detailed_view .work-place').text().trim();
            job.level = $(element).find('.detailed_view .captions-field:contains("Level:")').text().trim().replace('Level: ', '');
            job.deadline = $(element).find('.detailed_view .text-danger').text().trim();

            // Add the extracted job information to the array
            jobs.push(job);
        });

        // Move to the next page
        page++;
    }

    // Return the extracted job information
    return jobs;
}

scrapeJobs()