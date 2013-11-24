#pragma strict

var health : int = 100;
var speed : double = .5; // max speed
var bullet_pref : Transform; // prefab used for bullets
var fireRate : float = .5;
var nextShot : float = 0.0;
var moveForce : float = 365f; // determines force added
var range : int;
var attack : int;
var attackSpeed : int;
var damage : int; // the ammount of damage done by this actor
var armor : int; // resistance to damage
var vision : int; // how far this actor can see

// skill counters
var fireAoeMax : int; // time in between AOE skills
var fireAoeCounter: int; // countdown to recharge skill

// for determining the direction of a bullet
public var left : int;
public var right : int;
public var up : int;
public var down : int;

// lists
var enemyList : GameObject[];

function Start () {
	// set initial values
	left = 0;
	right = 0;
	up = 1;
	down = 0;
	
	// initilize lists
	enemyList = GameObject.FindGameObjectsWithTag('Enemy') as GameObject[];
	
	// skill counters
	fireAoeCounter = fireAoeMax;
}

function Update () {
	// run clock
	Clock();
		
	if (Input.GetAxis("Vertical") == 0 && Input.GetAxis("Horizontal") != 0){
		up = 0;
		down = 0;
	}
	
	// Cache the horizontal input.
		var h : float = Input.GetAxis("Horizontal");
		var v : float = Input.GetAxis("Vertical");

		// The Speed animator parameter is set to the absolute value of the horizontal input.
		//anim.SetFloat("Speed", Mathf.Abs(h));
		
		// If the player is changing direction (h has a different sign to velocity.x) or hasn't reached maxSpeed yet...
		if(h * rigidbody2D.velocity.x < speed)
			// ... add a force to the player.
			rigidbody2D.AddForce(Vector2.right * h * moveForce);

		// If the player's horizontal velocity is greater than the maxSpeed...
		if(Mathf.Abs(rigidbody2D.velocity.x) > speed)
			// ... set the player's velocity to the maxSpeed in the x axis.
			rigidbody2D.velocity = new Vector2(Mathf.Sign(rigidbody2D.velocity.x) * speed, rigidbody2D.velocity.y);
			
		// set to zero
		if (h == 0) {
			rigidbody2D.velocity = new Vector2(0,rigidbody2D.velocity.y);
			if (v != 0) {
				left = 0;
				right = 0;
			}
		}
		
		// set direction
		if (h > 0) {
			right = 1;
			left = 0;
		}
		
		if (h < 0) {
			left = 1;
			right = 0;
		}

	// Cache the vertical input.
		// The Speed animator parameter is set to the absolute value of the horizontal input.
		//anim.SetFloat("Speed", Mathf.Abs(h));
		
		// If the player is changing direction (h has a different sign to velocity.x) or hasn't reached maxSpeed yet...
		if(v * rigidbody2D.velocity.y < speed)
			// ... add a force to the player.
			rigidbody2D.AddForce(Vector2.up * v * moveForce);

		// If the player's horizontal velocity is greater than the maxSpeed...
		if(Mathf.Abs(rigidbody2D.velocity.y) > speed)
			// ... set the player's velocity to the maxSpeed in the x axis.
			rigidbody2D.velocity = new Vector2(rigidbody2D.velocity.x,Mathf.Sign(rigidbody2D.velocity.y) * speed);
		
		// set direction
		if (v > 0) {
			up = 1;
			down = 0;
		}
		
		if (v < 0) {
			down = 1;
			up = 0;
		}

		// set to zero
		if (v == 0) {
			rigidbody2D.velocity = new Vector2(rigidbody2D.velocity.x,0);
			
			if (h != 0) {
				up = 0;
				down = 0;
			}
		}
	
	// shoot
	if (Input.GetAxis("FireBullet")){
	 	if (Time.time >= nextShot){
	 		// create an instance of the bullet
	 		Instantiate(bullet_pref,Vector2(transform.position.x,transform.position.y),Quaternion.identity);
	 		
	 		// prevent the player from firing again immediately
	 		nextShot = Time.time + fireRate;
		}
	}
	
	// use skills
	if (Input.GetAxis("Skill1") > 0) {
		FireAreaDamage();
	}
}

function FireAreaDamage(){
		if (fireAoeCounter <= 0) {
		// increase counter to max
		fireAoeCounter = fireAoeMax;
		
		Debug.Log("AOE Attack");
		
		// do AOE damage
		enemyList = GameObject.FindGameObjectsWithTag('Enemy') as GameObject[];
		
		// run through enemy array
		for(var i : int = 0; i < enemyList.length; i++){
			//Debug.Log("Enemy " + i);
			if (Vector2.Distance(transform.position, enemyList[i].transform.position) < range) {
				//Debug.Log("I am here!");
				// do damage to enemy
				if (attack + Random.Range(0,4) > enemyList[i].GetComponent(scr_Enemy).armor){
					// decrease health
					enemyList[i].GetComponent(scr_Enemy).currentHealth -= damage + Random.Range(0,2);
				}
			}
		}
	}
}


function Clock(){
	// fire AOE
	if (fireAoeCounter > 0) {
		fireAoeCounter--;
	}
}

/*
function DetectCollision(){
	// this is for debugging purposes
	switch(System.Convert.ToInt32(Random.Range(0,4))){
		case 0:
		Debug.Log("Such collision");
		break;
		
		case 1:
		Debug.Log("Much fizziks");
		break;
		
		case 2:
		Debug.Log("Stopped doge");
		break;
		
		case 3:
		Debug.Log("Wow");
		break;
	}
	
}*/