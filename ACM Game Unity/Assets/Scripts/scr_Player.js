#pragma strict

var health : int = 100;
var speed : double = .5; // max speed
var bullet_pref : Transform; // prefab used for bullets
var fireRate : float = .5;
var nextShot : float = 0.0;
var moveForce : float = 365f; // determines force added

// for determining the direction of a bullet
public var left : int;
public var right : int;
public var up : int;
public var down : int;

function Start () {
	// set initial values
	left = 0;
	right = 0;
	up = 1;
	down = 0;
}

function Update () {	
	/* OLD MOVE STYLE
	//     MOVE X
	// uses a raycast 1/2 the width of the sprite and checks for collisions.  If returns false, create a vector in that direction
	// right
	if (Input.GetAxis("Horizontal") > 0){
		if (!Physics2D.Raycast(transform.position+Vector2(0,0),Vector2(1,0),.55) && !Physics2D.Raycast(transform.position+Vector2(0,-.5),Vector2(1,0),.55)){
			transform.Translate(Vector2(1 * speed * Time.deltaTime,0));
		} else DetectCollision();
		
		// update directional variables
		right = 1;
		left = 0;
		
		// turn sprite
		renderer.material.mainTextureScale = new Vector2(1,-1);
	}
	
	// left
	if (Input.GetAxis("Horizontal") < 0){
		if (!Physics2D.Raycast(transform.position+Vector2(0,0),Vector2(-1,0),.55) && !Physics2D.Raycast(transform.position+Vector2(0,-.5),Vector2(-1,0),.55)){
			transform.Translate(Vector2(-1 * speed * Time.deltaTime,0));
		} else DetectCollision();
		
		// update directional variables
		left = 1;
		right = 0;
		
		// turn sprite 
		renderer.material.mainTextureScale = new Vector2(-1,-1);
	}
	
	//     MOVE Y
	// up
	if (Input.GetAxis("Vertical") > 0){
		if (!Physics2D.Raycast(transform.position+Vector2(.5,-.5),Vector2(0,1),.55) && !Physics2D.Raycast(transform.position+Vector2(-.5,-.5),Vector2(0,1),.55)){
			transform.Translate(Vector2(0,1 * speed * Time.deltaTime));
		} else DetectCollision();
		
		// update directional variables
		up = 1;
		down = 0;
	}
	
	// down
	if (Input.GetAxis("Vertical") < 0){
		if (!Physics2D.Raycast(transform.position+Vector2(.5,0),Vector2(0,-1),.55) && !Physics2D.Raycast(transform.position+Vector2(-.5,0),Vector2(0,-1),.55)){
			transform.Translate(Vector2(0,-1 * speed * Time.deltaTime));
		} else DetectCollision();
		
		// update directional variables
		down = 1;
		up = 0;
	}
	
	// the following methods ensure that there is no way for all directional values to be zero, which would prevent bullets from being shot.
	// these methods also prevent bullets from always being shot out of the corners of the player.
	if (Input.GetAxis("Horizontal") == 0 && Input.GetAxis("Vertical") != 0) {
		left = 0;
		right = 0;
	}
	
	if (Input.GetAxis("Vertical") == 0 && Input.GetAxis("Horizontal") != 0){
		up = 0;
		down = 0;
	} */
	
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

		// If the input is moving the player right and the player is facing left...
		/*if(h > 0 && !facingRight)
			// ... flip the player.
			Flip();
		// Otherwise if the input is moving the player left and the player is facing right...
		else if(h < 0 && facingRight)
			// ... flip the player.
			Flip();*/
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
	
}

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
	
}