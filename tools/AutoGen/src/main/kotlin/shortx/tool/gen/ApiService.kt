/*
 * (C) Copyright 2022 Thanox
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

package shortx.tool.gen

import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.adapter.rxjava2.RxJava2CallAdapterFactory
import retrofit2.converter.gson.GsonConverterFactory
import retrofit2.http.GET
import retrofit2.http.Path

interface ApiService {

    @GET("/repos/shortx-repo/files/contents/da")
    suspend fun getDAFiles(): List<GithubFileInfo>

    @GET("/repos/shortx-repo/files/contents/da/{name}")
    suspend fun getDAFileContent(@Path("name") name: String): GithubFileContent

    @GET("/repos/shortx-repo/files/contents/rule")
    suspend fun getRuleFiles(): List<GithubFileInfo>

    @GET("/repos/shortx-repo/files/contents/rule/{name}")
    suspend fun getRuleFileContent(@Path("name") name: String): GithubFileContent

    object Factory {
        private const val BASE_URL = "https://api.github.com"

        private val logging = HttpLoggingInterceptor {
            Logger.debug(it)
        }.apply {
            setLevel(HttpLoggingInterceptor.Level.BODY)
        }

        fun create(token: String): ApiService {
            // https://docs.github.com/en/rest/guides/getting-started-with-the-rest-api?apiVersion=2022-11-28&tool=curl
            // "Authorization: Bearer YOUR-TOKEN"
            val client = OkHttpClient.Builder().addInterceptor(logging)
                .addNetworkInterceptor { chain ->
                    val requestBuilder: Request.Builder = chain.request().newBuilder()
                    requestBuilder.header("Authorization", "Bearer $token")
                    chain.proceed(requestBuilder.build())
                }
                .build()
            val retrofit: Retrofit = Retrofit.Builder()
                .baseUrl(BASE_URL)
                .addConverterFactory(GsonConverterFactory.create())
                .addCallAdapterFactory(RxJava2CallAdapterFactory.create())
                .client(client)
                .build()
            return retrofit.create(ApiService::class.java)
        }
    }
}