.PHONY: coverage

coverage:
	test ! -d lib-orig
	mv lib lib-orig
	jscoverage lib-orig lib
	mocha tests -R html-cov > coverage.html
	test ! -d lib-cov || rm -rf lib-cov
	mv lib lib-cov
	mv lib-orig lib