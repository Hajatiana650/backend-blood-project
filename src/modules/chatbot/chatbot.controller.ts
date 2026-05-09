import { Controller, Post, Body } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';
import { ApiBody, ApiTags } from '@nestjs/swagger';

@ApiTags('Chatbot')
@Controller('chatbot')
export class ChatbotController {
  constructor(private chatbotService: ChatbotService) {}

  @Post('message')
  @ApiBody({ 
    schema: { 
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Quel est le stock sanguin ?' }
      }
    } 
  })
  async sendMessage(@Body() body: { message: string }) {
    const response = await this.chatbotService.processMessage(body.message);
    return {
      user: body.message,
      bot: response,
      timestamp: new Date(),
    };
  }
}
