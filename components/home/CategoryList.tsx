import React from 'react';
import { ScrollView, TouchableOpacity, Text, View } from 'react-native';

interface CategoryListProps {
    categories: string[];
    selectedCategory: string;
    onSelectCategory: (category: string) => void;
}

export const CategoryList: React.FC<CategoryListProps> = ({
    categories,
    selectedCategory,
    onSelectCategory,
}) => {
    return (
        <View className="my-4">
            <Text className="text-xl font-bold px-4 mb-2 text-gray-800">Categories</Text>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 16 }}
                className="flex-row"
            >
                <TouchableOpacity
                    onPress={() => onSelectCategory('All')}
                    className={`px-4 py-2 rounded-full mr-2 ${selectedCategory === 'All' ? 'bg-blue-600' : 'bg-gray-200'
                        }`}
                >
                    <Text
                        className={`font-medium ${selectedCategory === 'All' ? 'text-white' : 'text-gray-700'
                            }`}
                    >
                        All
                    </Text>
                </TouchableOpacity>
                {categories.map((category) => (
                    <TouchableOpacity
                        key={category}
                        onPress={() => onSelectCategory(category)}
                        className={`px-4 py-2 rounded-full mr-2 ${selectedCategory === category ? 'bg-blue-600' : 'bg-gray-200'
                            }`}
                    >
                        <Text
                            className={`font-medium ${selectedCategory === category ? 'text-white' : 'text-gray-700'
                                }`}
                        >
                            {category}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};
