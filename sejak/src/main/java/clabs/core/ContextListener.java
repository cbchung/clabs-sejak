package clabs.core;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

import org.apache.log4j.Logger;

public class ContextListener implements ServletContextListener {

	Logger logger = Logger.getLogger(getClass());
	
	@Override
	public void contextInitialized(ServletContextEvent sce) {
		logger.info("OK startup ----------------");
	}

	@Override
	public void contextDestroyed(ServletContextEvent sce) {
		logger.info("NOW destroyed --------------");
	}

}
