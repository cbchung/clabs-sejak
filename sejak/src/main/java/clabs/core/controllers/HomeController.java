package clabs.core.controllers;

import java.text.DateFormat;
import java.util.Date;
import java.util.Locale;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import clabs.core.services.MembershipService;

/**
 * Handles requests for the application home page.
 */
@RestController
public class HomeController {
		
	Logger logger = LoggerFactory.getLogger(getClass());
	
	@Autowired
	MembershipService memberService;
	
	/**
	 * Simply selects the home view to render by returning its name.
	 */
	@RequestMapping(value = "/hello", method = RequestMethod.GET)
	public String hello(Locale locale, Model model) {
		
		logger.info("Welcome home! The client locale is {}." + locale);
		
		Date date = new Date();
		DateFormat dateFormat = DateFormat.getDateTimeInstance(DateFormat.LONG, DateFormat.LONG, locale);
		
		String formattedDate = dateFormat.format(date);
		
//		model.addAttribute("serverTime", formattedDate );
//		int rc = memberService.create(null);
		
//		return "home:" + Integer.toString(rc);
		return "home:" + formattedDate;
	}
	
	/*
	@RequestMapping(value="/tewt", method = RequestMethod.POST, headers = {"content-type=application/json"})
	public @ResponseBody Xxxx xxx((@RequestBody XXXRequest request) throws Exception{

	}
	
	@RequestMapping(value = "/employees/{id}")
    public ResponseEntity<MembershipVO> getEmployeeById (@PathVariable("id") int id)
    {
        if (id <= 3) {
        	MembershipVO employee = new MembershipVO();
            return new ResponseEntity<MembershipVO>(employee, HttpStatus.OK);
        }
        return new ResponseEntity<MembershipVO>(HttpStatus.NOT_FOUND);
    }
	*/
}
