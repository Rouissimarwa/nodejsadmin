class user{
  final string id;
  final string firstname;
  final string lastname;
  final string email;
  final string numérotélephone;
  final string password;
  final string city;
  final string adresse;
  final string zip;
  final string gendre;

user(
  {
    required this.id;
    required this.firstname;
    required this.lastname;
    required this.numérotélephone;
    required this.city;
    required this.adresse;
    required this.zip;
    required this.gendre;
  });
  }

  Map<string,dynamic> toMap (){
    return {
      'id':id,
      'firstname':firstname,
      "lastname":lastname,
      "email":email,
      "password":password,
      "adresse":adresse,
      "city":city,
      "zip":zip,
      "gendre":gendre,



    }
  }
  factory user.fromMap(Map<string,dynamic>Map){
    return user(
      id:Map['id']??'',
      firstname.Map['firstname']??'',
      lastname.Map['lastname']??'',
     email.Map['email']??,'',
     password.Map['password"']??,'',
     adresse.Map['adresse']??,'',
     city.Map['city']??,'',
     zip.Map['zip']??,'',
     gendre.Map['gendre']??,'',
    );
  }
  string tojson()=>json.encode(toMap());
  factory user.fromjson(string source)=>user .fromMap(json.decode(source))