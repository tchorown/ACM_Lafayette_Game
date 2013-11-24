package com.alicrow.collisionMapGenerator;

import com.badlogic.gdx.backends.lwjgl.LwjglApplication;
import com.badlogic.gdx.backends.lwjgl.LwjglApplicationConfiguration;

public class Main {
	public static void main(String[] args) {
		LwjglApplicationConfiguration cfg = new LwjglApplicationConfiguration();
		cfg.title = "CollisionMapGenerator";
		cfg.useGL20 = false;
		cfg.width = 960;
		cfg.height = 640;
		
		new LwjglApplication(new MainGame(), cfg);
	}
}
