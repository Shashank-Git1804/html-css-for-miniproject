let count=0;
async function fetchGeneticDisorderInfo(query) {
  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = '';

  if (!query) {
    resultsDiv.innerHTML = '<p class="error">Please select or type a valid disorder name.</p>';
    return;
  }

  try {
    const response = await fetch(`https://medlineplus.gov/download/genetics/condition/${query}.json`);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    if (data) {
      let synonymList = data['synonym-list'] || [];
      const div = document.createElement('div');
      div.classList.add('result');

      const textList = data['text-list'];
      let textListContent = textList && Array.isArray(textList) ? textList[0]?.text?.html || 'No content available.' : 'No content available.';

      div.innerHTML = `
        <h3>${data.name || 'No title available.'}</h3>
        <p><strong>Published:</strong> ${data.published || 'N/A'}</p>
        <p><strong>Reviewed:</strong> ${data.reviewed || 'N/A'}</p>
        <h4>Text List:</h4>
        ${textListContent}
        <h4>Synonyms:</h4>
        <ul>
          ${synonymList.slice(0, 5).map(s => `<li>${s.synonym}</li>`).join('')}
        </ul>
      `;
      resultsDiv.appendChild(div);
    } else {
      resultsDiv.innerHTML = '<p>No data found.</p>';
    }
  } catch (error) {
    resultsDiv.innerHTML = `<p class="error">Error: ${error.message}</p>`;
  }
}

// Extract the disease name from the query parameter
const urlParams = new URLSearchParams(window.location.search);
const disease = urlParams.get('disease');

// Fetch information for the selected disease
if (disease) {
  fetchGeneticDisorderInfo(disease);
}

const searchInput = document.getElementById('search');
  searchInput.addEventListener("input", (e) => {
    const query = e.target.value.trim();
    fetchGeneticDisorderInfo(query);
  });

  if(count!=1 && !disease){
    fetchGeneticDisorderInfo('down-syndrome');
    count=1;
  }