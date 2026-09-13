Backend improvement 1
Backend improvement 2
Backend improvement 3
Maintenance update 1
Performance tweak 1
Documentation update 1
Security update 1
Post-holiday update 1
New year start 1
January feature 2
January update 2
January development 1
January development 4
January development 7
Jan 1 commit
Jan 11 commit
Jan 18 commit
Jan 25 commit
Jan 30 commit
Feb 2 commit
Feb 6 commit
Feb 10 commit
Feb 15 commit
Feb 19 commit
Feb 24 commit
Feb 28 commit
Feb 1 Sunday commit
Mar 8 Sunday commit
Mar 29 Sunday commit
Mar 5 commit
Mar 11 commit
Mar 16 commit
Mar 20 commit
Mar 25 commit
Mar 30 commit
June 9 development work
Added a database-aware readiness endpoint at GET /api/health/ready.
Added a database-independent liveness endpoint at GET /api/health/live and service metadata to health responses.
Health responses now disable caching and include consistent startup, uptime, and version metadata.
Added request IDs, timing logs, bounded request bodies, graceful shutdown protection, and runtime health metrics.
October 9: rejected unsafe request ID header values before echoing them.
October 10: included response size in completed request logs when available.
October 11: exposed the resolved HTTP status in structured error responses.
October 12: aligned readiness metadata with the main health response.
October 13: added Node and process metadata to the root API status response.
October 14: included the process ID in the startup log for operational tracing.
September 13: included request correlation IDs in all health probe responses.
