package clabs.core.services.mapper;

import java.util.List;
import java.util.Map;

import clabs.core.services.models.MembershipVO;


public interface MembershipMapper {

	public int create(Map<String, Object> parameter);
	
	public int insertOne(Map<String, Object> parameter);
	
	public List<MembershipVO> list(Map<String, Object> parameter);
	
	public MembershipVO getOne(Map<String, Object> parameter);
}
