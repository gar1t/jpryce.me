gen:
	lpad-gen

publish: gen
	s3cmd sync --no-mime-magic -P --delete-removed site/* s3://www.jpryce.me
