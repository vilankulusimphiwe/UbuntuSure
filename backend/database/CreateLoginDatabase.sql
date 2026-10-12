-- UbuntuSure login users.
-- The API checks UserName and PasswordHash. It does not store tokens.

IF DB_ID(N'UbuntuSure') IS NULL
BEGIN
    CREATE DATABASE UbuntuSure;
END
GO

USE UbuntuSure;
GO

IF NOT EXISTS (SELECT 1 FROM sys.schemas WHERE name = N'identity')
BEGIN
    EXEC(N'CREATE SCHEMA [identity]');
END
GO

IF OBJECT_ID(N'[identity].[Users]', N'U') IS NULL
BEGIN
    CREATE TABLE [identity].[Users]
    (
        UserId INT IDENTITY(1, 1) NOT NULL
            CONSTRAINT PK_Users PRIMARY KEY,
        UserName NVARCHAR(100) NOT NULL,
        PasswordHash VARBINARY(32) NOT NULL,
        DisplayName NVARCHAR(200) NOT NULL,
        FirstName NVARCHAR(100) NOT NULL,
        JobTitle NVARCHAR(150) NULL,
        IsActive BIT NOT NULL
            CONSTRAINT DF_Users_IsActive DEFAULT (1),
        IsAdmin BIT NOT NULL
            CONSTRAINT DF_Users_IsAdmin DEFAULT (0),
        CONSTRAINT UQ_Users_UserName UNIQUE (UserName)
    );
END
GO

-- Demo employee used by the login screen: snkosi / Password1
-- HASHBYTES on an NVARCHAR value uses UTF-16. The API must hash the same way.
IF NOT EXISTS (SELECT 1 FROM [identity].[Users] WHERE UserName = N'snkosi')
BEGIN
    INSERT INTO [identity].[Users]
        (UserName, PasswordHash, DisplayName, FirstName, JobTitle)
    VALUES
        (
            N'snkosi',
            HASHBYTES('SHA2_256', N'Password1'),
            N'Sarah Nkosi',
            N'Sarah',
            N'Claims Consultant'
        );
END
GO
