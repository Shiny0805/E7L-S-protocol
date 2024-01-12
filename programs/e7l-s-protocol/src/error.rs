use num_derive::FromPrimitive;
use solana_program::{
    decode_error::DecodeError,
    msg,
    program_error::{PrintProgramError, ProgramError},
};
use thiserror::Error;

#[derive(Error, Clone, Debug, Eq, PartialEq, FromPrimitive)]
pub enum E7lSProtocolError {
    /// 0 - Invalid System Program
    #[error("Invalid System Program")]
    InvalidSystemProgram,
    /// 1 - Error deserializing account
    #[error("Error deserializing account")]
    DeserializationError,
    /// 2 - Error serializing account
    #[error("Error serializing account")]
    SerializationError,
}

impl PrintProgramError for E7lSProtocolError {
    fn print<E>(&self) {
        msg!(&self.to_string());
    }
}

impl From<E7lSProtocolError> for ProgramError {
    fn from(e: E7lSProtocolError) -> Self {
        ProgramError::Custom(e as u32)
    }
}

impl<T> DecodeError<T> for E7lSProtocolError {
    fn type_of() -> &'static str {
        "E7l S Protocol Error"
    }
}
