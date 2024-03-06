build_image:
	docker buildx build -t kwiatekus/bookstore .
	docker push kwiatekus/bookstore