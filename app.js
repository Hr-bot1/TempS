// Event listener for the "Generate Temp Email" button
document.getElementById("generateBtn").addEventListener("click", function () {
  generateTempEmail();
});

// Adding color-changing animation to the header text
const animatedText = document.getElementById('animatedText');
let colorCycleInterval;

function startColorAnimation() {
  animatedText.style.animation = 'colorChange 12s infinite';
}

startColorAnimation();

// Function to generate a temporary email using the 1secmail API
async function generateTempEmail() {
  try {
    // 1secmail API endpoint for generating a random mailbox
    const url = "https://www.1secmail.com/api/v1/";
    const params = new URLSearchParams({
      'action': 'genRandomMailbox',
      'count': '1'
    });
    const response = await fetch(`${url}?${params}`, {
      headers: {
        'User-Agent': 'okhttp/3.9.1',
        'Accept-Encoding': 'gzip'
      }
    });

    // Parsing the JSON response
    const data = await response.json();
    const email = data[0]; // Get the first email in the array

    // Display the generated email in the input field
    document.getElementById("tempEmail").value = email;

    // Fetch the inbox for the generated email
    fetchInbox(email);
  } catch (error) {
    console.error("Error generating temp email:", error);
  }
}

// Function to fetch the inbox for the generated email using the 1secmail API
async function fetchInbox(email) {
  try {
    // Split the email into username and domain parts
    const [name, domain] = email.split('@');

    // 1secmail API endpoint for getting the messages in the inbox
    const url = "https://www.1secmail.com/api/v1/";
    const params = new URLSearchParams({
      'action': 'getMessages',
      'login': name,
      'domain': domain
    });

    // Fetch messages from the inbox
    const response = await fetch(`${url}?${params}`, {
      headers: {
        'User-Agent': 'okhttp/3.9.1',
        'Accept-Encoding': 'gzip'
      }
    });

    // Parse the response as JSON
    const messages = await response.json();
    let emailList = document.getElementById("emailList");
    emailList.innerHTML = ''; // Clear current email list

    // Check if there are any messages and display them
    if (messages && messages.length > 0) {
      messages.forEach(message => {
        const emailItem = document.createElement('div');
        emailItem.classList.add("emailItem");
        emailItem.innerHTML = `
          <p><strong>From:</strong> ${message.sender}</p>
          <p><strong>Subject:</strong> ${message.subject}</p>
          <p><strong>Message:</strong> ${message.text.slice(0, 100)}...</p>
        `;
        emailList.appendChild(emailItem);
      });
    } else {
      // If no messages are found, display a message
      emailList.innerHTML = "<p>No emails received yet.</p>";
    }
  } catch (error) {
    console.error("Error fetching inbox:", error);
  }
                       }
