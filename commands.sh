aws cloudformation create-stack --stack-name master-devops-stack --capabilities CAPABILITY_NAMED_IAM --template-body file://repo_permisos.yml --parameters ParameterKey=RepositoryName,ParameterValue=testrepo

---

aws iam create-user --user-name test

aws iam attach-user-policy --user-name test --policy-arn arn:aws:iam::864613434505:policy/RepoPolicyMasterDevOps

aws iam create-login-profile --user-name test --password Abc.12345 --no-password-reset-required

aws iam create-access-key --user-name test

---

aws iam detach-user-policy --user-name test --policy-arn arn:aws:iam::864613434505:policy/RepoPolicyMasterDevOps

aws iam delete-login-profile --user-name test

aws iam delete-access-key --user-name test --access-key-id

aws iam delete-user --user-name test

