DROP TABLE IF EXISTS MEMBER;
CREATE TABLE MEMBER (
	id			VARCHAR(32) NOT NULL,		-- 아이디
	passwd	VARCHAR(32),					-- 비밀번호
	name		VARCHAR(32),					-- 이름
	crdate		DATETIME default NOW(),		-- 등록일
	redate		DATETIME not null default NOW(),		-- 최종 수정일
		
	PRIMARY KEY (id)
);
CREATE INDEX IF NOT EXISTS MEMBER_REDATE ON MEMBER ( redate );

-- 시스템 관리용 Table
DROP TABLE IF EXISTS SEJAK;
CREATE TABLE SEJAK (
	version	VARCHAR(16)	NOT NULL,						-- 현재 버전
	sysuser	VARCHAR(32)	NOT NULL default 'admin',	-- 시스템 관리자 아이디
	release	INTEGER			NOT NULL default 0,			-- 버전별 Release 번호
    crdate		DATETIME		default NOW(),					-- 등록일
    redate		DATETIME 		default NOW()					-- 최종 수정일
);
INSERT INTO SEJAK ( version ) VALUES ( '0.1' );
