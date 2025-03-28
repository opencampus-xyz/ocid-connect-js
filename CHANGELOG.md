# Changelog

All notable changes to this project will be documented in this file.

## [v2.0.0] - 2025-03-28
### Changed
- Authentication Client Id.
- New updated spinner while waiting for token exchange.

## [v1.2.3] - 2024-11-04
### Changed
- Add logoutReturnTo as an optional parameter to logout method so users can instruct OC Service to return to a designation url after logging out.

## [v1.2.2] - 2024-10-16
### Changed
- Add new properties to OCAuthCore:
    - OCId
    - ethAddress
    - State parameters (from signup process)

## [v1.2.1] - 2024-10-03
### Changed
- Add methods to access parsed data from idToken and accessToken

## [v1.2.0] - 2024-09-22
### Added
- Add logout function to instruct OC to log user out of OC Service

## [v1.1.2] - 2024-08-28
### Changed
- Add option to send referral code to registration process.
- Referral code is used in OpenCampus for bonus points.

## [v1.1.0] - 2024-08-22
### Added
- Improved cross-domain storage handling
- Implemented cookie-based storage option:
  - Added `storageType: 'cookie'` option
  - Added `cookieDomain` configuration for domain specification

## [v1.0.1] - 2024-08-06
### Added
- Initial release
