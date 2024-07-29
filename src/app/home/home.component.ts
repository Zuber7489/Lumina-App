import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild, Renderer2 } from '@angular/core';
import { SpeechRecognition } from '@capacitor-community/speech-recognition';
import { TextToSpeech } from '@capacitor-community/text-to-speech';
import { Router } from '@angular/router';
import { GeminiServiceService } from '../gemini-service.service';
import { ActionSheetController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {

  @ViewChild('submitButton') submitButton!: ElementRef;
  isCopied = false;
  isLoading = false;
  isListening: boolean = false;
  isReading = false;
  title = 'ChatBotX';
  inputText = '';
  outputText = '';
  recognition: any = null;
email:any;
chatHistory: { type: string, text: string }[] = [];
  constructor( private cdRef: ChangeDetectorRef, private renderer: Renderer2,public router:Router,public geminiService:GeminiServiceService,public actionSheetController: ActionSheetController) {
    SpeechRecognition.requestPermission();
  }

  ngOnInit() {this.email=localStorage.getItem('loggedInUserEmail')  


  // Load chat history from localStorage
  const savedChatHistory = localStorage.getItem('chatHistory');
  if (savedChatHistory) {
    this.chatHistory = JSON.parse(savedChatHistory);
  }

  if (!localStorage.getItem('loggedInUserEmail') || !localStorage.getItem('loggedInUserPassword')) {
    this.router.navigate(['login']);
  }
  
}


  async startRecognition() {
    const { available } = await SpeechRecognition.available();

    if (available) {
      this.isListening = true;
      SpeechRecognition.start({
        popup: false,
        partialResults: true,
        language: 'en-US'
      });


      SpeechRecognition.addListener('partialResults', (data: any) => {
        if (data.matches && data.matches.length > 0) {
          console.log('partial result fire', data.matches);
          this.inputText = data.matches[0];
          this.cdRef.detectChanges();
        }

        if (data.value && data.value.length > 0) {
          this.inputText = data.value[0];
          this.cdRef.detectChanges();
        }

      });
    }
  }
  async stopRecognition() {
    this.isListening = false;
    await SpeechRecognition.stop();
    this.cdRef.detectChanges();
  }

  async onSubmit() {
    // Check for input validation first
    if (!this.inputText.trim()) {
      alert('Please fill data first.');
      return;
    }
  
    // Save user query to chatHistory before making the API call
    this.chatHistory.push({ type: 'user', text: this.inputText });
  
     // Save the original user input before clearing inputText
  const prompt = this.inputText;

    // Clear inputText
    this.inputText = '';
  
    this.isLoading = true;
  
    try {
      
      this.outputText = await this.geminiService.generateContent(prompt);
  
      this.isLoading = false;
    } catch (error) {
      console.error('Error generating content:', error);
      this.isLoading = false;
    }
  
    // Save bot response to chatHistory
    this.chatHistory.push({ type: 'bot', text: this.outputText });
  
    // Save chatHistory to localStorage
    localStorage.setItem('chatHistory', JSON.stringify(this.chatHistory));
  }
  


 


  onCopyClick(index:number) {
    const responseToCopy = this.chatHistory[index]?.text;
    if (responseToCopy) {
      const textarea = document.createElement('textarea');
      textarea.value = responseToCopy;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      this.isCopied = true;
      setTimeout(() => (this.isCopied = false), 2000);
    }
  }
  
  isVoicePlaying: boolean = false;
  activeIndex: number = -1;
  speakText(index: number) {
    const responseToCopy = this.chatHistory[index]?.text;

    if (this.isVoicePlaying && this.activeIndex === index) {
      // If playing, stop speaking
      TextToSpeech.stop();
      this.isVoicePlaying = false;
      this.activeIndex = -1;
    } else {
      // If not playing or a different button is clicked, start speaking
      TextToSpeech.speak({
        text: responseToCopy,
      });
      this.isVoicePlaying = true;
      this.activeIndex = index;
    }
  }
  isActiveButton(index: number): boolean {
    return this.isVoicePlaying && this.activeIndex === index;
  }


  

logout(){
  localStorage.removeItem('loggedInUserEmail');
  localStorage.removeItem('loggedInUserPassword'); 
  this.router.navigate(['login']) 
}



async clearChatHistory() {
  const actionSheet = await this.actionSheetController.create({
    header: 'Clear Chat History',
    cssClass: 'my-custom-class',
    buttons: [
      {
        text: 'Confirm',
        role: 'destructive',
        icon: 'trash',
        handler: () => {
          this.chatHistory = [];
          localStorage.removeItem('chatHistory');
        }
      },
      {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }
    ]
  });
  await actionSheet.present();
}


formatMessageText(text: string): string {
  const boldedText = text.replace(/\*\*(.*?)\*\*/g, (_, word) => `<strong>${word}</strong>`);

  // Wrap each line in a <div> and handle code blocks with <pre> tags
  const lines = boldedText.split('\n');
  let insideCodeBlock = false;

  const formattedText = lines.map((line, index) => {
    if (line.trim().startsWith('```')) {
      // Toggle the code block status
      insideCodeBlock = !insideCodeBlock;
      return insideCodeBlock ? '<pre class="code-block">' : '</pre>';
    } else {
      
      return `<div>${line}</div>`;
    }
  }).join('');

  return formattedText;
}

goToAvatarPage(){
  this.router.navigate(['avatar'])
}



}