-- Sample tables for the UbuntuSure screens.
-- Login still uses [identity].[Users]. This script does not change the API.
-- The short lists are the rows shown on each page.
-- The dashboard tables are the bigger chart numbers shown on the dashboard.

USE UbuntuSure;
GO

IF COL_LENGTH(N'identity.Users', N'Area') IS NULL
BEGIN
    ALTER TABLE [identity].[Users]
        ADD Area NVARCHAR(100) NULL;
END
GO

IF COL_LENGTH(N'identity.Users', N'IsAdmin') IS NULL
BEGIN
    ALTER TABLE [identity].[Users]
        ADD IsAdmin BIT NOT NULL
            CONSTRAINT DF_Users_IsAdmin DEFAULT (0);
END
GO

UPDATE [identity].[Users]
SET Area = N'Claims'
WHERE UserName = N'snkosi'
  AND Area IS NULL;
GO

-- Other staff from the Administration screen.
-- PasswordHash matches Password1, the same hash the login screen already uses.
IF NOT EXISTS (SELECT 1 FROM [identity].[Users] WHERE UserName = N'tmokoena')
BEGIN
    INSERT INTO [identity].[Users]
        (UserName, PasswordHash, DisplayName, FirstName, JobTitle, IsActive, Area)
    VALUES
        (N'tmokoena', HASHBYTES('SHA2_256', N'Password1'), N'Thandi Mokoena', N'Thandi', N'Claims Team Lead', 1, N'Claims');
END
GO

IF NOT EXISTS (SELECT 1 FROM [identity].[Users] WHERE UserName = N'pnaidoo')
BEGIN
    INSERT INTO [identity].[Users]
        (UserName, PasswordHash, DisplayName, FirstName, JobTitle, IsActive, Area)
    VALUES
        (N'pnaidoo', HASHBYTES('SHA2_256', N'Password1'), N'Peter Naidoo', N'Peter', N'Underwriter', 1, N'Policies');
END
GO

IF NOT EXISTS (SELECT 1 FROM [identity].[Users] WHERE UserName = N'akhan')
BEGIN
    INSERT INTO [identity].[Users]
        (UserName, PasswordHash, DisplayName, FirstName, JobTitle, IsActive, Area)
    VALUES
        (N'akhan', HASHBYTES('SHA2_256', N'Password1'), N'Ayesha Khan', N'Ayesha', N'Finance Clerk', 0, N'Payments');
END
GO

IF NOT EXISTS (SELECT 1 FROM sys.schemas WHERE name = N'customer')
    EXEC(N'CREATE SCHEMA [customer]');
GO
IF NOT EXISTS (SELECT 1 FROM sys.schemas WHERE name = N'quote')
    EXEC(N'CREATE SCHEMA [quote]');
GO
IF NOT EXISTS (SELECT 1 FROM sys.schemas WHERE name = N'policy')
    EXEC(N'CREATE SCHEMA [policy]');
GO
IF NOT EXISTS (SELECT 1 FROM sys.schemas WHERE name = N'claim')
    EXEC(N'CREATE SCHEMA [claim]');
GO
IF NOT EXISTS (SELECT 1 FROM sys.schemas WHERE name = N'payment')
    EXEC(N'CREATE SCHEMA [payment]');
GO
IF NOT EXISTS (SELECT 1 FROM sys.schemas WHERE name = N'document')
    EXEC(N'CREATE SCHEMA [document]');
GO
IF NOT EXISTS (SELECT 1 FROM sys.schemas WHERE name = N'report')
    EXEC(N'CREATE SCHEMA [report]');
GO
IF NOT EXISTS (SELECT 1 FROM sys.schemas WHERE name = N'dashboard')
    EXEC(N'CREATE SCHEMA [dashboard]');
GO

IF OBJECT_ID(N'[customer].[Customers]', N'U') IS NULL
BEGIN
    CREATE TABLE [customer].[Customers]
    (
        CustomerId INT IDENTITY(1, 1) NOT NULL
            CONSTRAINT PK_Customers PRIMARY KEY,
        CustomerNumber NVARCHAR(30) NOT NULL,
        CustomerName NVARCHAR(200) NOT NULL,
        CustomerType NVARCHAR(20) NOT NULL,
        Town NVARCHAR(100) NOT NULL,
        PolicyCount INT NOT NULL,
        Status NVARCHAR(20) NOT NULL,
        MemberSince DATE NOT NULL,
        CONSTRAINT UQ_Customers_CustomerNumber UNIQUE (CustomerNumber)
    );
END
GO

IF NOT EXISTS (SELECT 1 FROM [customer].[Customers])
BEGIN
    INSERT INTO [customer].[Customers]
        (CustomerNumber, CustomerName, CustomerType, Town, PolicyCount, Status, MemberSince)
    VALUES
        (N'CUS-2026-01421', N'Thabo Molefe', N'Person', N'Johannesburg', 2, N'Active', '20240112'),
        (N'CUS-2026-01408', N'Nomsa Dlamini', N'Person', N'Durban', 1, N'Active', '20240303'),
        (N'CUS-2026-01390', N'Johan Botha', N'Person', N'Pretoria', 1, N'Active', '20230819'),
        (N'CUS-2026-01102', N'Molefe Transport (Pty) Ltd', N'Business', N'Johannesburg', 3, N'Active', '20210204'),
        (N'CUS-2026-01355', N'Lerato Mkhize', N'Person', N'Soweto', 0, N'Prospect', '20260928'),
        (N'CUS-2026-01440', N'Candice Peters', N'Person', N'Bloemfontein', 0, N'Prospect', '20261001'),
        (N'CUS-2026-01280', N'Sipho Nkosi', N'Person', N'Cape Town', 1, N'Lapsed', '20221111');
END
GO

IF OBJECT_ID(N'[quote].[Quotes]', N'U') IS NULL
BEGIN
    CREATE TABLE [quote].[Quotes]
    (
        QuoteId INT IDENTITY(1, 1) NOT NULL
            CONSTRAINT PK_Quotes PRIMARY KEY,
        QuoteNumber NVARCHAR(30) NOT NULL,
        CustomerId INT NOT NULL,
        Product NVARCHAR(50) NOT NULL,
        Premium DECIMAL(12, 2) NOT NULL,
        Status NVARCHAR(20) NOT NULL,
        QuoteDate DATE NOT NULL,
        CONSTRAINT UQ_Quotes_QuoteNumber UNIQUE (QuoteNumber),
        CONSTRAINT FK_Quotes_Customers FOREIGN KEY (CustomerId)
            REFERENCES [customer].[Customers] (CustomerId)
    );
END
GO

IF NOT EXISTS (SELECT 1 FROM [quote].[Quotes])
BEGIN
    INSERT INTO [quote].[Quotes]
        (QuoteNumber, CustomerId, Product, Premium, Status, QuoteDate)
    SELECT N'QT-2026-00789', CustomerId, N'Motor', 1850.00, N'Pending', '20261003'
    FROM [customer].[Customers] WHERE CustomerNumber = N'CUS-2026-01421'
    UNION ALL
    SELECT N'QT-2026-00785', CustomerId, N'Home', 920.00, N'Pending', '20261002'
    FROM [customer].[Customers] WHERE CustomerNumber = N'CUS-2026-01440'
    UNION ALL
    SELECT N'QT-2026-00780', CustomerId, N'Motor', 2140.00, N'Accepted', '20261002'
    FROM [customer].[Customers] WHERE CustomerNumber = N'CUS-2026-01390'
    UNION ALL
    SELECT N'QT-2026-00776', CustomerId, N'Contents', 310.00, N'Quoted', '20261001'
    FROM [customer].[Customers] WHERE CustomerNumber = N'CUS-2026-01355'
    UNION ALL
    SELECT N'QT-2026-00771', CustomerId, N'Motor', 1640.00, N'Expired', '20260930'
    FROM [customer].[Customers] WHERE CustomerNumber = N'CUS-2026-01280';
END
GO

IF OBJECT_ID(N'[policy].[Policies]', N'U') IS NULL
BEGIN
    CREATE TABLE [policy].[Policies]
    (
        PolicyId INT IDENTITY(1, 1) NOT NULL
            CONSTRAINT PK_Policies PRIMARY KEY,
        PolicyNumber NVARCHAR(30) NOT NULL,
        CustomerId INT NOT NULL,
        Product NVARCHAR(50) NOT NULL,
        Premium DECIMAL(12, 2) NOT NULL,
        Status NVARCHAR(20) NOT NULL,
        RenewalDate DATE NOT NULL,
        CONSTRAINT UQ_Policies_PolicyNumber UNIQUE (PolicyNumber),
        CONSTRAINT FK_Policies_Customers FOREIGN KEY (CustomerId)
            REFERENCES [customer].[Customers] (CustomerId)
    );
END
GO

IF NOT EXISTS (SELECT 1 FROM [policy].[Policies])
BEGIN
    INSERT INTO [policy].[Policies]
        (PolicyNumber, CustomerId, Product, Premium, Status, RenewalDate)
    SELECT N'POL-2026-22018', CustomerId, N'Motor', 1850.00, N'In force', '20270112'
    FROM [customer].[Customers] WHERE CustomerNumber = N'CUS-2026-01421'
    UNION ALL
    SELECT N'POL-2026-22002', CustomerId, N'Home', 740.00, N'In force', '20270303'
    FROM [customer].[Customers] WHERE CustomerNumber = N'CUS-2026-01421'
    UNION ALL
    SELECT N'POL-2026-21880', CustomerId, N'Motor', 1220.00, N'In force', '20270619'
    FROM [customer].[Customers] WHERE CustomerNumber = N'CUS-2026-01408'
    UNION ALL
    SELECT N'POL-2026-21710', CustomerId, N'Home', 890.00, N'Due soon', '20261101'
    FROM [customer].[Customers] WHERE CustomerNumber = N'CUS-2026-01390'
    UNION ALL
    SELECT N'POL-2026-20440', CustomerId, N'Motor', 6400.00, N'In force', '20270204'
    FROM [customer].[Customers] WHERE CustomerNumber = N'CUS-2026-01102'
    UNION ALL
    SELECT N'POL-2024-18802', CustomerId, N'Motor', 1640.00, N'Lapsed', '20251111'
    FROM [customer].[Customers] WHERE CustomerNumber = N'CUS-2026-01280';
END
GO

IF OBJECT_ID(N'[claim].[Claims]', N'U') IS NULL
BEGIN
    CREATE TABLE [claim].[Claims]
    (
        ClaimId INT IDENTITY(1, 1) NOT NULL
            CONSTRAINT PK_Claims PRIMARY KEY,
        ClaimNumber NVARCHAR(30) NOT NULL,
        CustomerId INT NOT NULL,
        ClaimType NVARCHAR(50) NOT NULL,
        Status NVARCHAR(30) NOT NULL,
        ClaimDate DATE NOT NULL,
        CONSTRAINT UQ_Claims_ClaimNumber UNIQUE (ClaimNumber),
        CONSTRAINT FK_Claims_Customers FOREIGN KEY (CustomerId)
            REFERENCES [customer].[Customers] (CustomerId)
    );
END
GO

IF NOT EXISTS (SELECT 1 FROM [claim].[Claims])
BEGIN
    INSERT INTO [claim].[Claims]
        (ClaimNumber, CustomerId, ClaimType, Status, ClaimDate)
    SELECT N'CLM-2026-001245', CustomerId, N'Motor Accident', N'Under Review', '20261002'
    FROM [customer].[Customers] WHERE CustomerNumber = N'CUS-2026-01421'
    UNION ALL
    SELECT N'CLM-2026-001240', CustomerId, N'Theft', N'Assessment', '20261002'
    FROM [customer].[Customers] WHERE CustomerNumber = N'CUS-2026-01408'
    UNION ALL
    SELECT N'CLM-2026-001238', CustomerId, N'Water Damage', N'Pending Info', '20261001'
    FROM [customer].[Customers] WHERE CustomerNumber = N'CUS-2026-01390'
    UNION ALL
    SELECT N'CLM-2026-001230', CustomerId, N'Accidental Damage', N'Approved', '20261001'
    FROM [customer].[Customers] WHERE CustomerNumber = N'CUS-2026-01355'
    UNION ALL
    SELECT N'CLM-2026-001201', CustomerId, N'Motor Accident', N'Registered', '20260930'
    FROM [customer].[Customers] WHERE CustomerNumber = N'CUS-2026-01280';
END
GO

IF OBJECT_ID(N'[payment].[Payments]', N'U') IS NULL
BEGIN
    CREATE TABLE [payment].[Payments]
    (
        PaymentId INT IDENTITY(1, 1) NOT NULL
            CONSTRAINT PK_Payments PRIMARY KEY,
        ReceiptNumber NVARCHAR(30) NOT NULL,
        CustomerId INT NOT NULL,
        PolicyId INT NOT NULL,
        Amount DECIMAL(12, 2) NOT NULL,
        Method NVARCHAR(30) NOT NULL,
        Status NVARCHAR(20) NOT NULL,
        PaymentDate DATE NOT NULL,
        CONSTRAINT UQ_Payments_ReceiptNumber UNIQUE (ReceiptNumber),
        CONSTRAINT FK_Payments_Customers FOREIGN KEY (CustomerId)
            REFERENCES [customer].[Customers] (CustomerId),
        CONSTRAINT FK_Payments_Policies FOREIGN KEY (PolicyId)
            REFERENCES [policy].[Policies] (PolicyId)
    );
END
GO

IF NOT EXISTS (SELECT 1 FROM [payment].[Payments])
BEGIN
    INSERT INTO [payment].[Payments]
        (ReceiptNumber, CustomerId, PolicyId, Amount, Method, Status, PaymentDate)
    SELECT N'RCT-2026-4410', c.CustomerId, p.PolicyId, 1850.00, N'Debit order', N'Paid', '20261003'
    FROM [customer].[Customers] c
    JOIN [policy].[Policies] p ON p.PolicyNumber = N'POL-2026-22018'
    WHERE c.CustomerNumber = N'CUS-2026-01421'
    UNION ALL
    SELECT N'RCT-2026-4402', c.CustomerId, p.PolicyId, 1220.00, N'EFT', N'Paid', '20261002'
    FROM [customer].[Customers] c
    JOIN [policy].[Policies] p ON p.PolicyNumber = N'POL-2026-21880'
    WHERE c.CustomerNumber = N'CUS-2026-01408'
    UNION ALL
    SELECT N'RCT-2026-4390', c.CustomerId, p.PolicyId, 890.00, N'Debit order', N'Pending', '20261002'
    FROM [customer].[Customers] c
    JOIN [policy].[Policies] p ON p.PolicyNumber = N'POL-2026-21710'
    WHERE c.CustomerNumber = N'CUS-2026-01390'
    UNION ALL
    SELECT N'RCT-2026-4381', c.CustomerId, p.PolicyId, 6400.00, N'EFT', N'Pending', '20261001'
    FROM [customer].[Customers] c
    JOIN [policy].[Policies] p ON p.PolicyNumber = N'POL-2026-20440'
    WHERE c.CustomerNumber = N'CUS-2026-01102'
    UNION ALL
    SELECT N'RCT-2026-4366', c.CustomerId, p.PolicyId, 1640.00, N'Card', N'Failed', '20260928'
    FROM [customer].[Customers] c
    JOIN [policy].[Policies] p ON p.PolicyNumber = N'POL-2024-18802'
    WHERE c.CustomerNumber = N'CUS-2026-01280';
END
GO

IF OBJECT_ID(N'[document].[Documents]', N'U') IS NULL
BEGIN
    CREATE TABLE [document].[Documents]
    (
        DocumentId INT IDENTITY(1, 1) NOT NULL
            CONSTRAINT PK_Documents PRIMARY KEY,
        DocumentName NVARCHAR(200) NOT NULL,
        CustomerId INT NOT NULL,
        DocumentType NVARCHAR(50) NOT NULL,
        LinkedTo NVARCHAR(30) NOT NULL,
        Status NVARCHAR(20) NOT NULL,
        AddedOn DATE NOT NULL,
        CONSTRAINT FK_Documents_Customers FOREIGN KEY (CustomerId)
            REFERENCES [customer].[Customers] (CustomerId)
    );
END
GO

IF NOT EXISTS (SELECT 1 FROM [document].[Documents])
BEGIN
    INSERT INTO [document].[Documents]
        (DocumentName, CustomerId, DocumentType, LinkedTo, Status, AddedOn)
    SELECT N'Motor schedule', CustomerId, N'Policy schedule', N'POL-2026-22018', N'Filed', '20240112'
    FROM [customer].[Customers] WHERE CustomerNumber = N'CUS-2026-01421'
    UNION ALL
    SELECT N'Home schedule', CustomerId, N'Policy schedule', N'POL-2026-22002', N'Filed', '20240303'
    FROM [customer].[Customers] WHERE CustomerNumber = N'CUS-2026-01421'
    UNION ALL
    SELECT N'Claim form', CustomerId, N'Claim form', N'CLM-2026-001240', N'Waiting', '20261002'
    FROM [customer].[Customers] WHERE CustomerNumber = N'CUS-2026-01408'
    UNION ALL
    SELECT N'ID copy', CustomerId, N'Proof of ID', N'CUS-2026-01355', N'Missing', '20260928'
    FROM [customer].[Customers] WHERE CustomerNumber = N'CUS-2026-01355'
    UNION ALL
    SELECT N'Fleet schedule', CustomerId, N'Policy schedule', N'POL-2026-20440', N'Filed', '20210204'
    FROM [customer].[Customers] WHERE CustomerNumber = N'CUS-2026-01102';
END
GO

IF OBJECT_ID(N'[report].[Reports]', N'U') IS NULL
BEGIN
    CREATE TABLE [report].[Reports]
    (
        ReportId INT IDENTITY(1, 1) NOT NULL
            CONSTRAINT PK_Reports PRIMARY KEY,
        ReportName NVARCHAR(100) NOT NULL,
        Description NVARCHAR(300) NOT NULL,
        Category NVARCHAR(30) NOT NULL,
        LastRun DATE NOT NULL
    );
END
GO

IF NOT EXISTS (SELECT 1 FROM [report].[Reports])
BEGIN
    INSERT INTO [report].[Reports]
        (ReportName, Description, Category, LastRun)
    VALUES
        (N'Policies by product', N'How many policies sit in Motor, Home, and Contents', N'Policies', '20261010'),
        (N'Claims by status', N'Open claims grouped the same way as the dashboard ring', N'Claims', '20261010'),
        (N'Premiums collected', N'Money paid this month, by customer', N'Premiums', '20261003'),
        (N'Quotes converted', N'Quotes that became a policy, and quotes that expired', N'Policies', '20261001');
END
GO

IF OBJECT_ID(N'[complaint].[Complaints]', N'U') IS NOT NULL
    DROP TABLE [complaint].[Complaints];
GO

IF EXISTS (SELECT 1 FROM sys.schemas WHERE name = N'complaint')
    DROP SCHEMA [complaint];
GO

IF OBJECT_ID(N'[dashboard].[SummaryCards]', N'U') IS NULL
BEGIN
    CREATE TABLE [dashboard].[SummaryCards]
    (
        SummaryCardId INT IDENTITY(1, 1) NOT NULL
            CONSTRAINT PK_SummaryCards PRIMARY KEY,
        SortOrder INT NOT NULL,
        Label NVARCHAR(50) NOT NULL,
        ValueText NVARCHAR(20) NOT NULL,
        ChangeText NVARCHAR(10) NOT NULL,
        Note NVARCHAR(50) NOT NULL,
        Icon NVARCHAR(50) NOT NULL,
        Tone NVARCHAR(20) NOT NULL
    );
END
GO

IF NOT EXISTS (SELECT 1 FROM [dashboard].[SummaryCards])
BEGIN
    INSERT INTO [dashboard].[SummaryCards]
        (SortOrder, Label, ValueText, ChangeText, Note, Icon, Tone)
    VALUES
        (1, N'Active Policies', N'12,421', N'+5%', N'vs last month', N'description', N'blue'),
        (2, N'Open Claims', N'248', N'+12%', N'vs last month', N'directions_car', N'red'),
        (3, N'Pending Quotes', N'73', N'-8%', N'vs last month', N'request_quote', N'green'),
        (4, N'Customers', N'1,892', N'+3%', N'vs last month', N'people', N'yellow');
END
GO

IF OBJECT_ID(N'[dashboard].[ClaimStatuses]', N'U') IS NULL
BEGIN
    CREATE TABLE [dashboard].[ClaimStatuses]
    (
        ClaimStatusId INT IDENTITY(1, 1) NOT NULL
            CONSTRAINT PK_ClaimStatuses PRIMARY KEY,
        SortOrder INT NOT NULL,
        Label NVARCHAR(30) NOT NULL,
        StatusCount INT NOT NULL,
        Color NVARCHAR(10) NOT NULL
    );
END
GO

IF NOT EXISTS (SELECT 1 FROM [dashboard].[ClaimStatuses])
BEGIN
    INSERT INTO [dashboard].[ClaimStatuses]
        (SortOrder, Label, StatusCount, Color)
    VALUES
        (1, N'Registered', 45, N'#1f6fb5'),
        (2, N'Under Review', 78, N'#3db5c8'),
        (3, N'Assessment', 62, N'#5cb85c'),
        (4, N'Pending Info', 28, N'#c5d045'),
        (5, N'Approved', 24, N'#f0a202'),
        (6, N'Repudiated', 11, N'#e5534b');
END
GO

IF OBJECT_ID(N'[dashboard].[PolicyProducts]', N'U') IS NULL
BEGIN
    CREATE TABLE [dashboard].[PolicyProducts]
    (
        PolicyProductId INT IDENTITY(1, 1) NOT NULL
            CONSTRAINT PK_PolicyProducts PRIMARY KEY,
        SortOrder INT NOT NULL,
        Label NVARCHAR(50) NOT NULL,
        PolicyValue INT NOT NULL
    );
END
GO

IF NOT EXISTS (SELECT 1 FROM [dashboard].[PolicyProducts])
BEGIN
    INSERT INTO [dashboard].[PolicyProducts]
        (SortOrder, Label, PolicyValue)
    VALUES
        (1, N'Motor', 6500),
        (2, N'Home Buildings', 3200),
        (3, N'Home Contents', 2100),
        (4, N'Portable Possessions', 1500),
        (5, N'Other', 800);
END
GO
