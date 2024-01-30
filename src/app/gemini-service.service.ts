import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class GeminiServiceService {
  private genAI: any;

  constructor() {
    const apiKey = environment.geminiApiKey
    // Initialize the GoogleGenerativeAI instance
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async generateContent(prompt: string): Promise<string> {
    try {
      // For text-only input, use the gemini-pro model
      const model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return text;
    } catch (error) {
      console.error('Error generating content:', error);
      throw error;
    }
  }
}
