use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint::ProgramResult,
    program::{invoke, invoke_signed},
    program_error::ProgramError,
    pubkey::Pubkey,
    system_instruction,
    sysvar::Sysvar,
};

pub enum AuthorityType {
    User,
    Nobody,
    Authority,
}

impl AuthorityType {
    pub fn from_u8(value: u8) -> Option<Self> {
        match value {
            0 => Some(Self::User),
            1 => Some(Self::Nobody),
            2 => Some(Self::Authority),
            _ => None,
        }
    }

    pub fn to_u8(&self) -> u8 {
        match self {
            Self::User => 0,
            Self::Nobody => 1,
            Self::Authority => 2,
        }
    }
}

pub struct AdminConfig {
    unlink_authority: AuthorityType,
    link_authority: AuthorityType,
    sync_authority: AuthorityType,
}

impl AdminConfig {
    pub fn new() -> Self {
        AdminConfig {
            unlink_authority: AuthorityType::User,
            link_authority: AuthorityType::User,
            sync_authority: AuthorityType::Anyone,
        }
    }

    pub fn update_unlink_authority(&mut self, authority: AuthorityType) {
        self.unlink_authority = authority;
    }

    pub fn update_link_authority(&mut self, authority: AuthorityType) {
        self.link_authority = authority;
    }

    pub fn update_sync_authority(&mut self, authority: AuthorityType) {
        self.sync_authority = authority;
    }
}

pub fn initialize_admin_account(
    program_id: &Pubkey,
    admin_account: &Pubkey,
    admin_seed:  &str,
) -> ProgramResult {
    let (admin_pda, _) = Pubkey::find_program_address(&[admin_seed.as_bytes()], program_id);

    if admin_account != &admin_pda {
        return Err(ProgramError::InvalidArgument);
    }

    let mut admin_config = AdminConfig::new();

    let admin_config_data = admin_config.try_to_vec().ok_or(ProgramError::InvalidArgument)?;

    let accounts = vec![AccountMeta::new(*admin_account, false)];
    let instruction = system_instruction::initialize_account(admin_account, &program_id);
    invoke(&instruction, &accounts)?;

    let accounts = vec![
        AccountMeta::new(*admin_account, false),
        AccountMeta::new_readonly(sysvar::rent::id(), false),
    ];
    let instruction = solana_program::instruction::initialize_data(
        admin_account,
        &AdminData::STATE_ACCOUNT_DATA_AUTHORITY,
        &admin_config_data,
    )?;
    invoke(&instruction, &accounts)?;

    Ok(())
}

pub fn update_admin_config(
    admin_account: &Pubkey,
    admin_seed: &str,
    new_config: AdminConfig,
) -> ProgramResult {
    let (admin_pda, _) = Pubkey::find_program_address(&[admin_seed.as_bytes()], &program_id);
    if admin_account != &admin_pda {
        return Err(ProgramError::InvalidArgument);
    }

    let new_config_data = new_config.try_to_vec().ok_or(ProgramError::InvalidArgument)?;

    let accounts = vec![
        AccountMeta::new(*admin_account, false),
        AccountMeta::new_readonly(sysvar::rent::id(), false),
    ];
    let instruction = solana_program::instruction::update_data(
        admin_account,
        &AdminData::STATE_ACCOUNT_DATA_AUTHORITY,
        &new_config_data,
    )?;
    invoke(&instruction, &accounts);

    Ok(())
}