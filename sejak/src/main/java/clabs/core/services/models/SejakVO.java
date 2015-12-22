package clabs.core.services.models;

public class SejakVO {

	String	version, sysuser;
	int		release;
	String	crDate, reDate;
	
	public String getVersion() {
		return version;
	}
	public void setVersion(String version) {
		this.version = version;
	}
	public String getSysuser() {
		return sysuser;
	}
	public void setSysuser(String sysuser) {
		this.sysuser = sysuser;
	}
	public int getRelease() {
		return release;
	}
	public void setRelease(int release) {
		this.release = release;
	}
	public String getCrDate() {
		return crDate;
	}
	public void setCrDate(String crDate) {
		this.crDate = crDate;
	}
	public String getReDate() {
		return reDate;
	}
	public void setReDate(String reDate) {
		this.reDate = reDate;
	}
}
