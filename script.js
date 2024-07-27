let selectedItem = null;

function dragStart(event) {
    event.dataTransfer.setData('text', event.target.dataset.label);
    event.dataTransfer.setData('text/html', event.target.innerHTML);
    setSelectedItem(event.target);  // Update selected item on drag start
}

function setSelectedItem(item) {
    if (selectedItem) {
        selectedItem.classList.remove('selected');  // Remove the outline from the previously selected item
    }
    selectedItem = item;
    if (selectedItem) {
        selectedItem.classList.add('selected');  // Add the outline to the newly selected item
    }
}

document.querySelectorAll('.track').forEach(track => {
    track.addEventListener('dragover', event => {
        event.preventDefault();
    });

    track.addEventListener('drop', event => {
        event.preventDefault();
        const label = event.dataTransfer.getData('text');
        const iconHTML = event.dataTransfer.getData('text/html');

        const newElement = document.createElement('div');
        newElement.classList.add('track-item');
        newElement.innerHTML = iconHTML;
        newElement.style.left = `${event.clientX - track.getBoundingClientRect().left}px`;
        newElement.style.top = `${event.clientY - track.getBoundingClientRect().top}px`;
        newElement.dataset.label = label;

        track.appendChild(newElement);
        setSelectedItem(null);  // Clear selectedItem after placing it
    });

    track.addEventListener('click', event => {
        if (selectedItem) {
            const label = selectedItem.dataset.label;
            const iconHTML = selectedItem.innerHTML;

            const newElement = document.createElement('div');
            newElement.classList.add('track-item');
            newElement.innerHTML = iconHTML;
            newElement.style.left = `${event.clientX - track.getBoundingClientRect().left}px`;
            newElement.style.top = `${event.clientY - track.getBoundingClientRect().top}px`;
            newElement.dataset.label = label;

            track.appendChild(newElement);

            setSelectedItem(null);  // Clear selectedItem after placing it
        }
    });
});

document.querySelectorAll('.item').forEach(item => {
    item.addEventListener('click', () => {
        setSelectedItem(item);
    });
});

document.getElementById('solve-button').addEventListener('click', () => {
    const track1Items = Array.from(document.querySelectorAll('#track-1 .track-item')).map(item => item.dataset.label);
    const track2Items = Array.from(document.querySelectorAll('#track-2 .track-item')).map(item => item.dataset.label);

    const track1Description = track1Items.length ? track1Items.join(', ') : "There is no obstruction on the track";
    const track2Description = track2Items.length ? track2Items.join(', ') : "There is no obstruction on the track";

    const problemDescription = `You are presented with a trolley problem. Track 1 has the following items: ${track1Description}. Track 2 has the following items: ${track2Description}. Based on the ethical implications of the items on the tracks, please decide which track the trolley should take and explain your reasoning. Respond in JSON format with "chosen_path" indicating the track the train should go down ("Track 1" or "Track 2") and "explanation" providing the reasoning. Reply with only the json with no other response. Do not include any markdown. chosen_path is the path that the train will go down and everybody on chosen_path will be killed. For example, if track 1 had a man on it, and track 2 had nobody on it, you would divert the track to track 2 so nobody is harmed, therefore you would output chosen_path is Track 2`;

    const makeRequest = (retryCount = 0) => {
        fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer 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',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                messages: [{ role: 'user', content: problemDescription }],
                model: 'llama3-8b-8192'
            })
        })
        .then(response => response.json())
        .then(data => {
            try {
                const result = JSON.parse(data.choices[0].message.content);
                console.log(result);
                const chosenTrack = result.chosen_path === 'Track 1' ? 'track-1' : 'track-2';

                // Remove any previous green highlights
                document.querySelectorAll('.track').forEach(track => track.classList.remove('green'));

                document.getElementById(chosenTrack).classList.add('green');
                document.getElementById('result-container').innerText = result.explanation;
            } catch (error) {
                console.error('Error parsing JSON:', error);
                if (retryCount < 5) { // Retry up to 5 times
                    setTimeout(() => makeRequest(retryCount + 1), 2000); // Wait 2 seconds before retrying
                } else {
                    document.getElementById('result-container').innerText = "Failed to get a valid response from the AI after multiple attempts.";
                }
            }
        })
        .catch(error => {
            console.error('Error:', error);
            if (retryCount < 5) { // Retry up to 5 times
                setTimeout(() => makeRequest(retryCount + 1), 2000); // Wait 2 seconds before retrying
            } else {
                document.getElementById('result-container').innerText = "Failed to get a valid response from the AI after multiple attempts.";
            }
        });
    };

    makeRequest(); // Initial request
});
