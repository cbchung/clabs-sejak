package clabs.core;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URISyntaxException;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.DisposableBean;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.core.JdbcTemplate;

import clabs.core.services.mapper.SejakMapper;
import clabs.core.services.models.SejakVO;

public class SysManager implements InitializingBean, DisposableBean {

	Logger logger = Logger.getLogger(getClass());

	@Value("#{app['manager.db.init'] ?: ''}")
	private String initDb;

	@Autowired
	private SejakMapper sejakMapper;

	JdbcTemplate jdbcTemplate;
	
	private SejakVO svo;

	public void setJdbcTemplate(JdbcTemplate jdbcTemplate) {
		this.jdbcTemplate = jdbcTemplate;
	}
	
	public SejakVO getSejakInfo(){ return svo; }

	public void afterPropertiesSet() {
		logger.debug("---------------------------------SysManager--------------");
		checkDatabase();
	}

	public void destroy() {
		logger.debug("---------------------------------SysManager---endOf-----------");
	}

	private void checkDatabase() {
		try {
			svo = sejakMapper.loadSejak();
			logger.debug("checkDatabase---:" + svo.getVersion() + "-" + svo.getRelease());
		} catch (Exception e) {
			logger.debug("checkExcpetion:" + e.toString());
			initDatabase();
		}
	}

	private void initDatabase() {
		logger.debug("initDb:" + initDb);
		File file = null;
		try {
			file = new File(getClass().getClassLoader().getResource(initDb).toURI());
			FileInputStream fis = new FileInputStream(file);
			BufferedReader br = new BufferedReader(new InputStreamReader(fis));

			String line = null;
			StringBuffer sb = new StringBuffer();
			while ((line = br.readLine()) != null) {
				int commentPtr = line.indexOf("--");
				if (commentPtr == 0)
					continue;
				if (commentPtr > 0)
					line = line.substring(0, commentPtr);
				line = line.replace("\t", " ").replace("   ", " ").replace("  ", " ");
				while (line.indexOf(";") != -1) {
					int ePtr = line.indexOf(";");
					sb.append(" " + line.substring(0, ePtr).trim());
					line = line.substring(ePtr + 1);
					jdbcTemplate.execute(sb.toString());
					sb = new StringBuffer();
				}
				if (line.trim().length() > 0)
					sb.append(" " + line.trim());
			}

			br.close();
		} catch (URISyntaxException e) {
			logger.debug("URISyntaxException:" + e.getMessage());
		} catch (FileNotFoundException e) {
			logger.debug("FileNotFoundException:" + e.getMessage());
		} catch (IOException e) {
			logger.debug("IOException:" + e.getMessage());
		} finally {
			logger.debug("OK:" + initDb);
		}
	}
}
