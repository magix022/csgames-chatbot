const chatForm = get('form');
const chatInput = get('input');
const chatBox = get('main');

answerCount = 0;

symptoms = []
age = 0;
gender = "";

appendMessage('bot', 'Hi, I am a medical AI assistant. I am here to help you');
appendMessage('bot', 'Is your situation an emergency? [yes/no]');

chatForm.addEventListener('submit', event => {
  event.preventDefault();
  const text = chatInput.value;
  if (!text) return;
  
  appendMessage('user', text);
  console.log(answerCount);
  process(text);
 // appendMessage('bot', res);
  chatInput.value = '';
});

function process(text){ 
  switch(answerCount){
    case 0:
      emergencyResponse(text);
      break;
    case 1:
      symptomsResponse(text);
      break;
    case 2:
      ageResponse(text);
      break;
    case 3:
      genderResponse(text);
      break;
    default:
      defaultCall(text);
  }
}

function genderResponse(text){
  if(text.toLowerCase() == "1"){
    gender = "male"
    answerCount++;
    appendMessage('bot', 'Thank you, I will now process your information');
    diagnosticCall(symptoms, age, gender);
  }
  else if(text.toLowerCase() == "2"){
    gender = "female"
    answerCount++;
    appendMessage('bot', 'Thank you, I will now process your information');
    diagnosticCall(symptoms, age, gender);
  }
  else if(text.toLowerCase() == "3"){
    gender = "other"
    answerCount++;
    appendMessage('bot', 'Thank you, I will now process your information');
    diagnosticCall(symptoms, age, gender);
  }
  else {
    appendMessage('bot', 'Please respond with a number 1-3');
  }
}


function ageResponse(text){
  if(isNaN(text)){
    appendMessage('bot', 'Please respond with a number');
  } else {
    age = text;
    appendMessage('bot', 'Thank you for providing your age. What gender do you identify as? 1.Male 2.Female 3.Other');
    answerCount++;
  }
}

function emergencyResponse(text){
  if(text.toLowerCase() == "yes"){
    appendMessage('bot', 'Please call 911');
    answerCount = 1000000;
  } else if(text.toLowerCase() == "no"){
    appendMessage('bot', 'What are your symptoms? 1.Cough 2.Fever 3.Shortness of breath 4.Sore throat 5.Loss of taste or smell 6.None of the above');
    answerCount++;
  } else {
    appendMessage('bot', 'Please respond with "yes" or "no"');
  }
}

function symptomsResponse(text){
  if(text.toLowerCase() == "1"){
    symptoms.push("Cough");
  } else if(text.toLowerCase() == "2"){
    symptoms.push("Fever");
  } else if(text.toLowerCase() == "3"){
    symptoms.push("Shortness of breath");
  } else if(text.toLowerCase() == "4"){
    symptoms.push("Sore throat");
  } else if(text.toLowerCase() == "5"){
    symptoms.push("Loss of taste or smell");
  } else if(text.toLowerCase() == "6"){
    answerCount++;
  } else {
    appendMessage('bot', 'Please respond with a number 1-6');
  }
  if(answerCount == 1){
    appendMessage('bot', 'Do you have any other symptoms? 1.Cough 2.Fever 3.Shortness of breath 4. Sore throat 5. Loss of taste or smell 6. No other symptoms');
  } else {
    appendMessage('bot', 'Thank you for providing your symptoms. How old are you?');
  }
}

function diagnosticCall(symptoms, age, gender){
  query({
    "inputs": "Question: I have the following symptoms: " + symptoms.join(", ") + ". I am " + age + " years old. What should I do?",
  }).then(res => {
    console.log(res);
    appendMessage('bot', res[0].generated_text);
  })
}

function symptomsCall(symptoms){
  query({
    "inputs": "I have the following symptoms: " + symptoms.join(", ") + ". What should I do?",
  }).then(res => {
    console.log(res);
    appendMessage('bot', res[0].generated_text);
  });
}

function defaultCall(text){
  // query({
  //   "inputs": text,
  // }).then(res => {
  //   console.log(res);
  //   appendMessage('bot', res[0].generated_text);
  // });
  appendMessage('bot', "Glad I could help. :)");
}

function appendMessage(side, text) {
  const bubble = `
    <div class="msg -${side}">
        <div class="bubble">${text}</div>
    </div>`;
  chatBox.insertAdjacentHTML('beforeend', bubble);
  chatBox.scrollTop += 500;
}

// Utils
function get(selector, root = document) {
  return root.querySelector(selector);
}

async function query(data) {
	const response = await fetch(
		"https://xevhza5rhd1jhkq8.us-east-1.aws.endpoints.huggingface.cloud",
		{
			headers: { 
				"Accept" : "application/json",
				"Content-Type": "application/json" 
			},
			method: "POST",
			body: JSON.stringify(data),
		}
	);
	const result = await response.json();
	return result;
}
