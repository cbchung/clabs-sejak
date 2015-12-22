package clabs.core.services.models;

public class MembershipVO {

	String id, pwd;
	String	crtpPwd, name;
	
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getPwd() {
		return pwd;
	}
	public void setPwd(String pwd) {
		this.pwd = pwd;
	}
	public String getCrtpPwd() {
		return crtpPwd;
	}
	public void setCrtpPwd(String crtpPwd) {
		this.crtpPwd = crtpPwd;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
}
