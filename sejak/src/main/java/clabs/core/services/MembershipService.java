package clabs.core.services;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import clabs.core.services.mapper.MembershipMapper;
import clabs.core.services.models.MembershipVO;

@Service("memberService")
public class MembershipService {

	@Autowired
	private MembershipMapper membershipMapper;
	
	public List<MembershipVO> getList(Map<String,Object> parameter){
		return membershipMapper.list(parameter);
	}
	
	public int create(Map<String,Object> parameter){
		return membershipMapper.create(parameter);
	}
}
