var members = ['han', 'jake0061', 'hoho'];
var roles = {
  'programmer':'egoing',
  'designer':'k8805',
  'manager':'hoya'
}

for(i=0;i<members.length;i++){
  console.log(members[i]);
}

for(var name in roles){
  console.log(name, '//' ,roles[name]);
}
