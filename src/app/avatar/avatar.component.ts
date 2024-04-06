import { ChangeDetectorRef, Component, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import {SitepalAngularModule} from 'sitepal-angular';
import { GeminiServiceService } from '../gemini-service.service';
import { ActionSheetController } from '@ionic/angular';
import { SpeechRecognition } from '@capacitor-community/speech-recognition';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
})
export class AvatarComponent  {
  inputText = '';
  outputText='';
  isLoading = false;
  isListening: boolean = false;
  constructor( private cdRef: ChangeDetectorRef, private renderer: Renderer2,public router:Router,public geminiService:GeminiServiceService,public actionSheetController: ActionSheetController) {
    SpeechRecognition.requestPermission();
  }
  sayAudioFn(sayAudioExample){
	
    globalThis.sayAudio('sayAudioExample');
  }
  sayTextFn(text,ip1,ip2,ip3){
    console.log(text,ip1,ip2,ip3);
    globalThis.sayText(text,ip1,ip2,ip3);
  }
  
   embed=[3432155,600,800,"''",1,1,2722664,0,1,1,"'WSGmJ3ScqO8d4Zop1cuILz7q4In5k6q2'",0];


async onSubmit() {
  this.isLoading=true;
    // Check for input validation first
    if (!this.inputText.trim()) {
      alert('Please fill data first.');
      return;
    }
     // Save the original user input before clearing inputText
  const prompt = this.inputText;
      this.outputText = await this.geminiService.generateContent(prompt);
if(this.outputText){
  this.sayTextFn(this.outputText, 3, 1, 3);
  this.isLoading=false;
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
}
