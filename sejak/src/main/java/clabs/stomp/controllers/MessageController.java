package clabs.stomp.controllers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import clabs.stomp.beans.Greeting;
import clabs.stomp.beans.HelloMessage;

@Controller
public class MessageController {
	
	Logger logger = LoggerFactory.getLogger(getClass());
	
	@MessageMapping("/hello")
    @SendTo("/topic/greetings")
    public Greeting greeting(HelloMessage message) throws Exception {
		logger.info("greeting:" + message.getName());
		return new Greeting("Hello, " + message.getName() + "!");
   }
}
